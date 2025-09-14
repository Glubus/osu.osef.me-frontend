import React from 'react';

const Maintenance: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-8">
          <div className="mb-4">
            <img 
              src="https://fbi.cults3d.com/uploaders/43366455/illustration-file/4463b0bf-58b5-4254-a92b-22df7b9cbd90/firefox_4Svq1NTba3.gif" 
              alt="Construction bee" 
              className="w-32 h-32 mx-auto rounded-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-base-content mb-4">
            Under Maintenance
          </h1>
        </div>
        
        <div className="space-y-4 text-base-content/80">
          <p className="text-lg">
            We're currently performing scheduled maintenance to improve your experience.
          </p>
          
          <p className="text-base">
            Our team is working hard to get everything back up and running smoothly.
          </p>
          
          <div className="bg-base-200 rounded-lg p-4 mt-6">
            <p className="text-sm font-medium text-base-content">
              Expected completion: Within the day
            </p>
          </div>
          
          <p className="text-sm text-base-content/60 mt-6">
            Thank you for your patience!
          </p>
        </div>
        
        <div className="mt-8">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
