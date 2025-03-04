import { IterationItemParser } from "../../../../models/adoSummary/iteration";
import { CompletedTag } from "../../../../models/ItemTag/CompletedTag";

export const CompletedParser: IterationItemParser = async (config, _workItem, workItemHistoryEvents, tags, _extra) => {
    let completedTag: CompletedTag = {
        completedByMe: false
    }

    for (const historyEvent of workItemHistoryEvents) {
        if (
            (
                historyEvent.fields?.["System.State"]?.newValue === 'Completed' ||
                historyEvent.fields?.["System.State"]?.newValue === 'Resolved' ||
                historyEvent.fields?.["System.State"]?.newValue === 'Closed'
            )
            ) {
                completedTag.completedByMe = true
            }
        if (
            historyEvent.fields?.["System.State"]?.newValue &&
            !(
                historyEvent.fields?.["System.State"].newValue === 'Completed' ||
                historyEvent.fields?.["System.State"].newValue === 'Resolved' ||
                historyEvent.fields?.["System.State"].newValue === 'Closed'
            )
            ) {
                completedTag.completedByMe = false
            }
    }

    return {
        ...tags,
        ...completedTag
    };
}