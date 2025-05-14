import React from 'react';

const ContentSection: React.FC = () => {
  const columns = [
    {
      id: 1,
      items: ["Text", "Text", "Text", "Text", "Text"]
    },
    {
      id: 2,
      items: ["Text", "Text", "Text", "Text", "Text"]
    },
    {
      id: 3,
      items: ["Text", "Text", "Text", "Text", "Text"]
    },
    {
      id: 4,
      items: ["Text", "Text", "Text", "Text", "Text"]
    },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-b border-luxury-brown-light py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {columns.map((column) => (
              <div key={column.id} className="space-y-4">
                {column.items.map((item, index) => (
                  <p key={index} className="text-luxury-black">{item}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <p className="text-luxury-black">Text</p>
          </div>
          <div className="col-span-1">
            <p className="text-luxury-black">Text</p>
          </div>
          <div className="col-span-1">
            <p className="text-luxury-black">Text</p>
          </div>
          <div className="col-span-1">
            <p className="text-luxury-black">Text</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;