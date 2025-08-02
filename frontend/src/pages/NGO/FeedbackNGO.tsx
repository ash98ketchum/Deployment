import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, MessageSquare } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface FeedbackFormData {
  organizationName: string;
  reviewFor: string;
  menuItem: string;
  rating: number;
  content: string;
  email: string;
}

const FeedbackNGO = () => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    organizationName: '',
    reviewFor: '',
    menuItem: '',
    rating: 0,
    content: '',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: keyof FeedbackFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const res = await fetch('http://localhost:4000/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error('Failed to submit feedback');
    }

    setSubmitted(true);
  } catch (error) {
    console.error(error);
    alert('Something went wrong. Please try again later.');
  } finally {
    setIsSubmitting(false);
  }
};


  const resetForm = () => {
    setFormData({
      organizationName: '',
      reviewFor: '',
      menuItem: '',
      rating: 0,
      content: '',
      email: '',
    });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto px-6 py-12"
        >
          <Card className="p-8 text-center" glow={true} hoverEffect={false}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your feedback has been submitted successfully. We appreciate your time and input!
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={resetForm} variant="solid" size="lg">
                Submit Another Review
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-50">
      {/* <div className="bg-white border-b border-gray-200"> */}
        {/* <div className="max-w-6xl mx-auto px-6 py-6">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="text-white" size={16} />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Create Review</h1>
              <p className="text-sm text-gray-600">NGO reviewing a restaurant experience</p>
            </div>
          </motion.div>
        </div> */}
      {/* </div> */}

      <div className="max-w-4xl mx-auto px-6 py-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8" glow={true} hoverEffect={false}>
            <h1 className="text-3xl font-bold text-gray-900 pb-3">Create <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent">
                            Review{' '}
                          </span></h1>
            <p className="text-lg text-gray-600 pb-3">NGO reviewing a restaurant experience</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Your NGO Name"
              />
              <input
                type="text"
                value={formData.reviewFor}
                onChange={(e) => handleInputChange('reviewFor', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Restaurant Being Reviewed"
              />
              <input
                type="text"
                value={formData.menuItem}
                onChange={(e) => handleInputChange('menuItem', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Menu Item (optional)"
              />

              {/* Rating */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="focus:outline-none"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      size={32}
                      className={`transition-colors duration-200 ${
                        star <= formData.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>

              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                placeholder="Your feedback..."
                maxLength={500}
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="your.email@example.com"
              />

              <Button
                type="submit"
                variant="solid"
                size="lg"
                isLoading={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackNGO;