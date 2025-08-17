import { useState } from "react";

export default function SettingsPage() {
  const [homeFolder, setHomeFolder] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // You could store it in localStorage or send to backend
    localStorage.setItem("homeFolder", homeFolder);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white flex flex-col items-center justify-center p-6">
      <div className="bg-[#202020] rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-xl font-semibold mb-6">Settings</h1>

        {/* Home Folder Input */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">
            Home Folder
          </label>
          <input
            type="text"
            value={homeFolder}
            onChange={(e) => setHomeFolder(e.target.value)}
            placeholder="Enter folder path..."
            className="w-full px-3 py-2 rounded bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-2 px-4 rounded bg-green-500 text-black font-semibold hover:scale-105 transition"
        >
          Save
        </button>

        {saved && (
          <p className="text-green-500 text-sm mt-4 text-center">
            Settings saved.
          </p>
        )}
      </div>
    </div>
  );
}
