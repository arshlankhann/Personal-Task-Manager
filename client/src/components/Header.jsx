export default function Header({ totalTasks, completedTasks }) {
  const activeTasks = totalTasks - completedTasks;
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

      {/* Active / Completed count pills */}
      {totalTasks > 0 && (
        <div className="flex gap-2 mt-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
            {activeTasks} active
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-700 border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
            {completedTasks} completed
          </span>
        </div>
      )}

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
