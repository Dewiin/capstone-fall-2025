import { Footer } from "@/components/Footer";
import { FaUser, FaKey } from "react-icons/fa";
import { PiWarningFill } from "react-icons/pi";
import { useState } from "react";

const allTabs = [
  { tabValue: 'account', label: 'account', icon: <FaUser className="text-xl" /> },
  { tabValue: 'authentication', label: 'authentication', icon: <FaKey className="text-xl" /> },
  { tabValue: 'dangerZone', label: 'danger zone', icon: <PiWarningFill className="text-xl" /> },
];

export function SettingsPage() {
    const [ currentTab, setCurrentTab ] = useState("account");

    return (
        <div
            className="md:mt-16 mt-8 p-4 flex flex-col h-screen"
        >   
            <div
                className="flex-1 flex md:flex-row flex-col gap-8"
            >
                <section
                    className="flex flex-col min-w-3xs h-fit py-4 rounded-2xl 
                    bg-slate-950 
                    border-1 border-indigo-200"
                >
                    {allTabs.map((tab, index) => (
                        <button
                            key={index}
                            className={`flex items-center gap-4 py-4 px-8 text-left
                            ${ currentTab === tab.tabValue ? "text-slate-100" : "text-slate-500" } 
                            hover:text-slate-100 active:text-slate-500 duration-150`}
                            onClick={() => setCurrentTab(tab.tabValue)}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </section>
                <section
                    className="w-full h-full"
                >
                    {/* account settings section */}
                    {currentTab === "account" && 
                        <div>
                            account stuff
                        </div>
                    }
                    {/* authentication settings section */}
                    {currentTab === "authentication" && 
                        <div>
                            authentication stuff
                        </div>
                    }
                    {/* danger zone settings section */}
                    {currentTab === "dangerZone" && 
    <div className="flex flex-col gap-8 p-4">
        {/* Reset Account Section */}
        <div className="flex justify-between items-center p-4 bg-slate-900 rounded-lg border border-red-600">
            <div className="flex flex-col">
                <h2 className="text-red-600 font-bold text-lg">Reset Account</h2>
                <p className="text-slate-400 text-sm">
                    Completely resets your account to a blank state.<br />
                    <span className="text-red-500 font-semibold">You can't undo this action!</span>
                </p>
            </div>
            <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                onClick={() => handleResetAccount()}
            >
                Reset Account
            </button>
        </div>

        {/* Delete Account Section */}
        <div className="flex justify-between items-center p-4 bg-slate-900 rounded-lg border border-red-600">
            <div className="flex flex-col">
                <h2 className="text-red-600 font-bold text-lg">Delete Account</h2>
                <p className="text-slate-400 text-sm">
                    Deletes your account and all data connected to it.<br />
                    <span className="text-red-500 font-semibold">You can't undo this action!</span>
                </p>
            </div>
            <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                onClick={() => handleDeleteAccount()}
            >
                Delete Account
            </button>
        </div>
    </div>
}
                </section>
            </div>
            <Footer />
        </div>
    )
}