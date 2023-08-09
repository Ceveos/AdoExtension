import { loadConfig } from "../../../models/adoConfig";
import { GetWIQL, GetWorkItems } from "../../api";

// Generates a proper ADO Summary for completed items for a given date range
export async function CompletedSummaryForDateRange(from: string, to: string) {
    const config = await loadConfig();
    let completedSummary = await GetWIQL(
            config,
`
SELECT [System.Id], [System.Title], [System.State], [System.AreaPath], [System.IterationPath], [System.CreatedDate], [System.ChangedDate]
FROM WorkItems
WHERE [System.AreaPath] UNDER '${config.projectPath.replaceAll('/', '\\')}'
AND [System.ChangedDate] >= '2023-04-01'
AND [System.ChangedDate] <= '2023-05-01'
`);
    return completedSummary;
}
