import { createContext, useState } from "react";

// Create the context
export const issueTrackingContext = createContext();

// Create the provider component
export const IssueTrackingContextProvider = ({ children }) => {
    const [selectedProject, setSelectedProject] = useState("");
    const [project_id, setProjectId] = useState("");
    const [taskSavedStatus, setTaskSavedStatus] = useState(false);
    const [loginResponse, setLoginResponse] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [showProjectList, setShowProjectList] = useState(true);
    const [newProjectSaved, setNewProjectSaved] = useState(false);
    const [addIssueStatus, setAddIssueStatus] = useState(false);


    return (
        <issueTrackingContext.Provider
            value={{
                selectedProject, setSelectedProject,
                project_id, setProjectId,
                taskSavedStatus, setTaskSavedStatus,
                setLoginResponse,
                isAuthenticated, setIsAuthenticated,
                showProjectList, setShowProjectList,
                newProjectSaved, setNewProjectSaved,
                addIssueStatus, setAddIssueStatus,
            }}>
            {children}
        </issueTrackingContext.Provider>
    );
};
