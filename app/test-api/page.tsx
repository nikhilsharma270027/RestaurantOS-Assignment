// app/test-api/page.tsx
"use client";
export default function TestApiPage() {
  return (
    <div className="p-8">
      <h1>Test Dashboard API</h1>
      <button 
        onClick={async () => {
          const res = await fetch("/api/dashboard");
          const data = await res.json();
          console.log("API Response:", data);
          alert(JSON.stringify(data, null, 2));
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Test API
      </button>
    </div>
  );
}