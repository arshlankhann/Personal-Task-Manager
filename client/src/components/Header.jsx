export default function Header({ totalTasks, completedTasks }) {
  const percent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Task Manager</h1>
        {totalTasks > 0 && (
          <span className="text-xs sm:text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {percent}% done
          </span>
        )}
      </div>
      <p className="text-sm sm:text-base text-gray-500 mt-1">
        {completedTasks} of {totalTasks} tasks completed
      </p>
      {totalTasks > 0 && (
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
          <div
            className="bg-blue-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}
