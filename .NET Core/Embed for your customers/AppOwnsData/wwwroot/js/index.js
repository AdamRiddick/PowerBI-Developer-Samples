// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

const rlsDatasetId = "3da5ea2e-25b0-4331-9d98-5f3de66a814a";

function getReport() {
    var models = window["powerbi-client"].models;
    var reportContainer = $("#report-container").get(0);
    var dataSetId = document.getElementById("datasource").value;

    var username = ''
    if (dataSetId == '3da5ea2e-25b0-4331-9d98-5f3de66a814a') {
        //RLS Dataset ID - Allow selection of a user & include the user in token generation
        username = document.getElementById("user").value;
    }

    $.ajax({
        type: "GET",
        url: "/embedinfo/getembedinfo/" + dataSetId + "/" + username,
        success: function (data) {
            let embedParams = $.parseJSON(data);
            let reportLoadConfig = {
                type: "report",
                tokenType: models.TokenType.Embed,
                accessToken: embedParams.EmbedToken.Token,
                // You can embed different reports as per your need
                embedUrl: embedParams.EmbedReport[0].EmbedUrl,
                id: embedParams.EmbedReport[0].ReportId,
                datasetBinding: {
                    datasetId: dataSetId,
                },
                settings: {
                    panes: {
                        filters: {
                            visible: false
                        },
                        pageNavigation: {
                            visible: false
                        }
                    }
                }
                // Enable this setting to remove gray shoulders from embedded report
                // settings: {
                //     background: models.BackgroundType.Transparent
                // }
            };

            // Use the token expiry to regenerate Embed token for seamless end user experience
            // Refer https://aka.ms/RefreshEmbedToken
            //tokenExpiry = embedParams.EmbedToken.Expiration;

            // Embed Power BI report when Access token and Embed URL are available
            var report = powerbi.embed(reportContainer, reportLoadConfig);

            // Clear any other loaded handler events
            report.off("loaded");

            // Triggers when a report schema is successfully loaded
            report.on("loaded", function () {
                console.log("Report load successful");
            });

            // Clear any other rendered handler events
            report.off("rendered");

            // Triggers when a report is successfully embedded in UI
            report.on("rendered", function () {
                console.log("Report render successful");
            });

            // Clear any other error handler events
            report.off("error");

            // Handle embed errors
            report.on("error", function (event) {
                var errorMsg = event.detail;

                // Use errorMsg variable to log error in any destination of choice
                console.error(errorMsg);
            });
        },
        error: function (err) {

            // Show error container
            var errorContainer = $(".error-container");
            $(".embed-container").hide();
            errorContainer.show();

            // Format error message
            var errMessageHtml = "<strong> Error Details: </strong> <br/>" + err.responseText;
            errMessageHtml = errMessageHtml.split("\n").join("<br/>");

            // Show error message on UI
            errorContainer.append(errMessageHtml);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("datasource").onchange = getReport;
    getReport();
});