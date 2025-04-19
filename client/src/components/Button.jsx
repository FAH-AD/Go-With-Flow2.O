export function Button({ children, ...props }) {
    return (
      <button
        {...props}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        {children}
      </button>
    );
  }
  