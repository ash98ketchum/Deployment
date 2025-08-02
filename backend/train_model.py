import json
import pickle
import os
import argparse
import pandas as pd
from datetime import datetime

# Base directory
BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, 'data', 'dataformodel.json')
MODEL_PATH = os.path.join(BASE_DIR, 'data', 'model.pkl')
SUMMARY_PATH = os.path.join(BASE_DIR, 'data', 'predicted.json')
FRONTEND_SUMMARY_PATH = os.path.abspath(
    os.path.join(BASE_DIR, '..', 'frontend', 'public', 'data', 'predicted.json')
)

class EpsilonGreedyAgent:
    def __init__(self, dishes, epsilon: float = 0.2):
        self.epsilon = epsilon
        self.dishes = dishes
        self.n_actions = len(dishes)
        self.q_values = [0.0] * self.n_actions
        self.counts = [0] * self.n_actions

    def select_action(self) -> int:
        import random
        if random.random() < self.epsilon:
            return random.randrange(self.n_actions)
        return max(range(self.n_actions), key=lambda a: self.q_values[a])

    def update(self, action: int, reward: float):
        self.counts[action] += 1
        n = self.counts[action]
        self.q_values[action] += (reward - self.q_values[action]) / n


def load_history(path: str) -> pd.DataFrame:
    if not os.path.exists(path):
        raise FileNotFoundError(f"Data file not found: {path}")
    raw = json.load(open(path, 'r'))
    rows = []
    for day in raw:
        for it in day.get('items', []):
            rows.append({'name': it.get('name'), 'totalEarning': it.get('totalEarning', 0)})
    return pd.DataFrame(rows)


def train_bandit(df: pd.DataFrame, epsilon: float, episodes: int) -> EpsilonGreedyAgent:
    dishes = df['name'].unique().tolist()
    agent = EpsilonGreedyAgent(dishes, epsilon)
    avg_rewards = df.groupby('name')['totalEarning'].mean().to_dict()
    for _ in range(episodes):
        a = agent.select_action()
        agent.update(a, avg_rewards.get(agent.dishes[a], 0))
    return agent


def write_summary(agent: EpsilonGreedyAgent, df: pd.DataFrame):
    avg_rewards = df.groupby('name')['totalEarning'].mean().round(2).to_dict()
    summary = {
        'trainedAt': datetime.now().isoformat(),
        'epsilon': agent.epsilon,
        'dishes': agent.dishes,
        'q_values': [round(v, 2) for v in agent.q_values],
        'counts': agent.counts,
        'averageRewards': avg_rewards,
        'bestAction': {
            'dish': agent.dishes[int(agent.q_values.index(max(agent.q_values)))],
            'value': round(max(agent.q_values), 2)
        }
    }
    # Save pickle
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(agent, f)
    # Write summaries
    os.makedirs(os.path.dirname(SUMMARY_PATH), exist_ok=True)
    json.dump(summary, open(SUMMARY_PATH, 'w'), indent=2)
    os.makedirs(os.path.dirname(FRONTEND_SUMMARY_PATH), exist_ok=True)
    json.dump(summary, open(FRONTEND_SUMMARY_PATH, 'w'), indent=2)
    print(f"[{datetime.now()}] Model & summary saved.")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--epsilon', type=float, default=0.2)
    parser.add_argument('--episodes', type=int, default=200)
    args = parser.parse_args()

    df = load_history(DATA_PATH)
    if df.empty:
        print("No historical data to train on. Exiting.")
        return

    agent = train_bandit(df, args.epsilon, args.episodes)
    write_summary(agent, df)


if __name__ == '__main__':
    main()