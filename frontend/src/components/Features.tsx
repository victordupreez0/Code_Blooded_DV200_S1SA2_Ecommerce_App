import React from 'react';

const features = [
  {
    id: 1,
    title: 'Feature 1',
    description: 'Feature description'
  },
  {
    id: 2,
    title: 'Feature 2',
    description: 'Feature description'
  },
  {
    id: 3,
    title: 'Feature 3',
    description: 'Feature description'
  },
  {
    id: 4,
    title: 'Feature 4',
    description: 'Feature description'
  },
  {
    id: 5,
    title: 'Feature 5',
    description: 'Feature description'
  }
];

const Features: React.FC = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-luxury-brown-light rounded-full flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-white rounded-full"></div>
              </div>
              <h3 className="text-lg font-medium text-luxury-black mb-1">{feature.title}</h3>
              <p className="text-sm text-luxury-brown-dark text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;