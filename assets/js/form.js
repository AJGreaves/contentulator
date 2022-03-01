/**
 * Handle all submit functionality
 * @param {obj} form 
 */
function handleSubmit(form) {
    // keys: name, glhWeight, inputID, glhOutputID
    let contentTypes = [
    {
        name: "textBasedUnit",
        type: "text",
        glhWeight: 1,
        inputID: "textUnitInput",
        glhOutputID: "textUnitOutput",
    },
    {
        name: "textChallenge",
        type: "text",
        glhWeight: 10,
        inputID: "textChallengeInput",
        glhOutputID: "textChallengeOutput",
    },
    {
        name: "quiz",
        type: "text",
        glhWeight: 1,
        inputID: "quizUnitInput",
        glhOutputID: "quizUnitOutput",
    },
    {
        name: "passiveVideo",
        type: "video",
        glhWeight: 1.2,
        inputID: "passiveVideoInput",
        glhOutputID: "passiveVideoOutput",
    },
    {
        name: "operationalVideo",
        type: "video",
        glhWeight: 3,
        inputID: "operationalVideoInput",
        glhOutputID: "operationalVideoOutput",
    },
    {
        name: "activeVideo",
        type: "video",
        glhWeight: 8,
        inputID: "activeVideoInput",
        glhOutputID: "activeVideoOutput",
    },
    {
        name: "intensiveVideo",
        type: "video",
        glhWeight: 11,
        inputID: "intensiveVideoInput",
        glhOutputID: "intensiveVideoOutput",
    },
    ]

    let avgVideoLength = document.getElementById("avgVideoLength").value;
    let contentLevel = document.getElementById("contentLevelInput").value;

    let totalGLH = calculateGlhPerType(contentTypes, avgVideoLength, contentLevel);

}

/**
 * Take contentTypes array of objects. Loop through array and reach into
 * data input by user to collect number of units per content type,
 * calculate GLH and display totals to the user.
 * Returns total GLH 
 * @param {arr} contentTypes 
 * @param {str} avgVideoLength 
 */
function calculateGlhPerType(contentTypes, avgVideoLength, contentLevel) {

    let totalGLH = 0;
    for (let i = 0; i < contentTypes.length; i++) {
        let inputValue = document.getElementById(contentTypes[i].inputID).value;
        let calculatedGLHinMins = 0;
        
        if (contentTypes[i].type === "video") {
            calculatedGLHinMins = parseInt(inputValue) * avgVideoLength * contentTypes[i].glhWeight;
        } else if (contentTypes[i].type === "text") {
            calculatedGLHinMins = parseInt(inputValue) * 10 * contentTypes[i].glhWeight;
        }

        // Multiply GLH by 3 if students at L3 level education
        if (contentLevel == "3") {
            calculatedGLHinMins = calculatedGLHinMins * 3;
        }
        
        let calculatedGLHinHours = (calculatedGLHinMins / 60).toFixed(2);
        document.getElementById(contentTypes[i].glhOutputID).innerText = calculatedGLHinHours + " hours";
        totalGLH += calculatedGLHinHours;
    }
    return totalGLH;

}