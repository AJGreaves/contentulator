/**
 * Handle all submit functionality
 * @param {obj} form 
 */
function handleSubmit(form) {
    // keys: name, glhWeight, inputID, glhOutputID
    let contentTypes = [{
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

    let totalGLH = calculateGLHPerType(contentTypes, avgVideoLength, contentLevel);
    let totalNumUnits = getTotalNumUnits(contentTypes);
    let totalHoursToComplete = calculateTotalHours(form, totalNumUnits);
    let totalDaysToComplete = totalHoursToComplete / 7.5; // 7.5 hours in a work day
    let totalWeeksToComplete = totalDaysToComplete / 5 // 5 days in a working week

    let projectedEndDate = getProjectedEndDate(totalDaysToComplete);

    displayResults(totalGLH, totalDaysToComplete, totalWeeksToComplete, projectedEndDate);
    styleResults(form, totalGLH, projectedEndDate);

    document.getElementById("resultsRow").classList.remove("d-none");
    window.scrollTo(0,document.body.scrollHeight);
}


function styleResults(form, totalGLH, projectedEndDate) {
    if (totalGLH < parseInt(form.totalGLHInput.value) - 5) {
        document.getElementById("totalGLHOutput").style = "color: red";
    } else if (totalGLH > parseInt(form.totalGLHInput.value) + 5) {
        document.getElementById("totalGLHOutput").style = "color: orange";
    } else {
        document.getElementById("totalGLHOutput").style = "color: green";
    }

    let willMeetDeadline = compareDates(form.deadlineInput.value, projectedEndDate);
    if (willMeetDeadline) {
        document.getElementById("endDate").style = "color: red";
    } else {
        document.getElementById("endDate").style = "color: green";
    }
}

/**
 * Compare dates and return true if projectedEndDate is earlier
 * than or equal to the deadline
 * sources: https://stackoverflow.com/questions/5619202/parsing-a-string-to-a-date-in-javascript
 * https://stackoverflow.com/questions/492994/compare-two-dates-with-javascript
 */
function compareDates(deadlineInput, projectedEndDate) {
    let parts = deadlineInput.split('-');
    // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
    // January - 0, February - 1, etc.
    let deadlineAsDateObject = new Date(parts[0], parts[1] - 1, parts[2]);
    return deadlineAsDateObject < projectedEndDate
}

/**
 * Take contentTypes array of objects. Loop through array and reach into
 * data input by user to collect number of units per content type,
 * calculate GLH and display totals to the user.
 * Returns total GLH 
 * @param {arr} contentTypes 
 * @param {str} avgVideoLength 
 */
function calculateGLHPerType(contentTypes, avgVideoLength, contentLevel) {

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

        let calculatedGLHinHours = (calculatedGLHinMins / 60);
        let formattedGHLHours = formatDecimalHoursIntoHoursAndMinutes(calculatedGLHinHours);
        document.getElementById(contentTypes[i].glhOutputID).innerText = formattedGHLHours;
        totalGLH += parseFloat(calculatedGLHinHours);
    }
    return totalGLH;

}

/**
 * Takes decimalTimeString and converts it to hours and minutes
 * Source: https://stackoverflow.com/questions/35460303/how-to-convert-decimal-hour-value-to-hhmmss
 */
function formatDecimalHoursIntoHoursAndMinutes(decimalTimeString) {
    let n = new Date(0, 0);
    n.setMinutes(+decimalTimeString * 60);
    let result = n.toTimeString().slice(0, 5);
    return result;
}

function calculateTotalHours(form, totalNumUnits) {
    let totalHours = 0;

    // Number of hours needed for each phase of project creation
    let contentCreationHours = {
        learningOutcomes: 12,
        assessmentCriteria: 32,
        syllabusCreation: 40,
        walkthroughProjectCreation: 160, // 160 for lg
        contentCreationPerUnit: 11,
    }

    if (!form.learningOutcomesDone.checked) {
        // Add hours to create learning outcomes
        totalHours += contentCreationHours.learningOutcomes;
    }

    if (!form.assessmentCriteriaDone.checked) {
        // Add hours to creat assessment criteria
        totalHours += contentCreationHours.assessmentCriteria;
    }

    if (!form.syllabusDone.checked) {
        // Add hours to create syllabus
        totalHours += contentCreationHours.syllabusCreation;
    }

    if (!form.wtpSize.checked) {
        // Add hours to create walkthrough project depending on size
        let projectSize = form.wtpSize.value;
        if (projectSize === "sm") {
            totalHours += (contentCreationHours.walkthroughProjectCreation / 4);
        } else if (projectSize === "md") {
            totalHours += (contentCreationHours.walkthroughProjectCreation / 2);
        } else if (projectSize === "lg") {
            totalHours += (contentCreationHours.walkthroughProjectCreation);
        }
    }

    // Add hours to create content
    totalHours += totalNumUnits * contentCreationHours.contentCreationPerUnit;

    // Add 20% to total hours as buffer
    let totalHoursPlus20PercentBuffer = (totalHours / 100) * 120
    return totalHoursPlus20PercentBuffer
}

/**
 * Loop through all unit number inputs and count total
 * effort for text based units is 50% of video, so this function
 * calculates .5 per text based unit
 */
function getTotalNumUnits(contentTypes) {
    let total = 0;
    for (let i = 0; i < contentTypes.length; i++) {
        let inputValue = document.getElementById(contentTypes[i].inputID).value;
        if (contentTypes[i].type === "text") {
            // text units take 50% less time to make than video
            total += (parseFloat(inputValue) / 2);
        } else {
            total += parseFloat(inputValue);
        }
    }
    return total;
}

/**
 * Take number of days to create course, add days for the weekends
 * Calculate date of completion
 * Source: https://stackoverflow.com/questions/563406/how-to-add-days-to-date
 */
function getProjectedEndDate(totalDaysToComplete) {
    let daysPlusWeekends = (totalDaysToComplete / 5) * 7;
    let result = new Date();
    result.setDate(result.getDate() + daysPlusWeekends);
    return result;
}


/**
 * Displays calculated results in results section
 */
function displayResults(totalGLH, totalDaysToComplete, totalWeeksToComplete, projectedEndDate) {
    let formattedTotalGLH = formatDecimalHoursIntoHoursAndMinutes(totalGLH);
    document.getElementById("totalGLHOutput").innerText = formattedTotalGLH;
    document.getElementById("totalDaysOutput").innerText = totalDaysToComplete.toFixed(1);
    document.getElementById("totalWeeksOutput").innerHTML = totalWeeksToComplete.toFixed(1);
    document.getElementById("endDate").innerHTML = projectedEndDate.toLocaleDateString('en-GB');

}