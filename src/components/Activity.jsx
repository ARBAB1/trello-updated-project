import React, { useState } from "react";
import { baseUrl } from "@/constant";

const ActivityList = ({ activity }) => {
  const [visibleCount, setVisibleCount] = useState(3); // Show only 3 activities initially

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 3); // Load 3 more on each click
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mt-4">Activity</h3>
      {activity.slice(0, visibleCount).map((activityItem) => (
        <div
          key={activityItem.activity_id}
          className="flex items-center bg-gray-800 p-4 rounded-lg mt-2 shadow-md"
        >
          {/* Profile Picture */}
          <img
            src={`${baseUrl}${activityItem.profile_picture_url}`}
            alt={activityItem.performed_by}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />

          <div>
            {/* User Name */}
            <p className="text-white font-semibold">{activityItem.performed_by}</p>

            {/* Activity Description */}
            <p className="text-gray-300 text-sm">{activityItem.activity_description}</p>

            {/* Formatted Date */}
            <p className="text-gray-500 text-xs">{new Date(activityItem.created_at).toLocaleString()}</p>
          </div>
        </div>
      ))}

      {/* Show "Load More" Button if there are more activities to load */}
      {visibleCount < activity.length && (
        <button
          onClick={loadMore}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition duration-200"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default ActivityList;
