import { Footer } from "@/components/Footer";
import { FaUser, FaKey } from "react-icons/fa";
import { PiWarningFill } from "react-icons/pi";
import { VscDebugRestart } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";
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
                className="flex-1 flex md:flex-row flex-col gap-12"
            >
                <section
                    className="flex flex-col min-w-3xs h-fit py-4 rounded-2xl 
                    dark:bg-slate-950 bg-indigo-200 
                    border-1 dark:border-indigo-200 border-indigo-950"
                >
                    {allTabs.map((tab, index) => (
                        <button
                            key={index}
                            className={`flex items-center gap-4 py-4 px-8 text-left
                            ${ currentTab === tab.tabValue ? "dark:text-slate-100 text-slate-950" : "text-slate-500" } 
                            hover:dark:text-slate-100 hover:text-slate-950
                            active:dark:text-slate-500 active:text-slate-500 duration-150`}
                            onClick={() => setCurrentTab(tab.tabValue)}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </section>
                <section
                    className="w-full h-full py-4"
                >
                    {/* account settings section */}
                    {currentTab === "account" && 
                        <div>
                            account stuff
                        </div>
                    }
                    {/* authentication settings section */}
                    {currentTab === "authentication" && 
                        <div className="grid gap-4">
                            {/* Reset Account Section */}
                            <div className="grid md:grid-cols-[2fr_1fr] grid-cols-[1fr] gap-4 items-center rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <VscDebugRestart className="text-xl" />
                                        <p>
                                            reset account
                                        </p>
                                    </div>
                                    <p>
                                        Completely resets your account to a blank state.<br />
                                        <span className="text-red-500">You can't undo this action!</span>
                                    </p>    
                                </div>
                                <button
                                    className="py-2 rounded-lg text-slate-950 font-semibold 
                                    dark:bg-red-500 bg-red-400
                                    hover:dark:bg-red-200 hover:bg-red-100
                                    active:dark:bg-gray-500 active:bg-gray-300"
                                    onClick={() => handleResetAccount()}
                                >
                                    reset account
                                </button>
                            </div>

                            {/* Delete Account Section */}
                            <div className="grid md:grid-cols-[2fr_1fr] grid-cols-[1fr] gap-4 items-center rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <MdDelete className="text-xl" />
                                        <p>
                                            delete account
                                        </p>
                                    </div>
                                    <p>
                                        Deletes your account and all data connected to it.<br />
                                        <span className="text-red-500">You can't undo this action!</span>
                                    </p>    
                                </div>
                                <button
                                    className="py-2 rounded-lg text-slate-950 font-semibold 
                                    dark:bg-red-500 bg-red-400
                                    hover:dark:bg-red-200 hover:bg-red-100
                                    active:dark:bg-gray-500 active:bg-gray-300"
                                    onClick={() => handleDeleteAccount()}
                                >
                                    delete account
                                </button>
                            </div>
                        </div>
                    }
                    {/* danger zone settings section */}
                    {currentTab === "dangerZone" && 
                        <div className="grid gap-4">
                            {/* Reset Account Section */}
                            <div className="grid md:grid-cols-[2fr_1fr] grid-cols-[1fr] gap-4 items-center rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <VscDebugRestart className="text-xl" />
                                        <p>
                                            reset account
                                        </p>
                                    </div>
                                    <p>
                                        Completely resets your account to a blank state.<br />
                                        <span className="text-red-500">You can't undo this action!</span>
                                    </p>    
                                </div>
                                <button
                                    className="py-2 rounded-lg text-slate-950 font-semibold 
                                    dark:bg-red-500 bg-red-400
                                    hover:dark:bg-red-200 hover:bg-red-100
                                    active:dark:bg-gray-500 active:bg-gray-300"
                                    onClick={() => handleResetAccount()}
                                >
                                    reset account
                                </button>
                            </div>

                            {/* Delete Account Section */}
                            <div className="grid md:grid-cols-[2fr_1fr] grid-cols-[1fr] gap-4 items-center rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <MdDelete className="text-xl" />
                                        <p>
                                            delete account
                                        </p>
                                    </div>
                                    <p>
                                        Deletes your account and all data connected to it.<br />
                                        <span className="text-red-500">You can't undo this action!</span>
                                    </p>    
                                </div>
                                <button
                                    className="py-2 rounded-lg text-slate-950 font-semibold 
                                    dark:bg-red-500 bg-red-400
                                    hover:dark:bg-red-200 hover:bg-red-100
                                    active:dark:bg-gray-500 active:bg-gray-300"
                                    onClick={() => handleDeleteAccount()}
                                >
                                    delete account
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