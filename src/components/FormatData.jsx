import he from 'he';
    // ********************************************************************************/
    //              Helper functions - formats TimeSpan to human readable form
    //                 Extract dd:hh:mm:ss from "dd.hh:mm:ss.ffffff"
    // ********************************************************************************/
    // 
    export function formatTimeSpan(timeSpanString) {
    if (!timeSpanString || timeSpanString === "00:00:00") {
        return 'No time recorded';
    }

    let days = 0, hours = 0, minutes = 0, seconds = 0;

    // Split on "." to separate days from hh:mm:ss
    let parts = timeSpanString.split(".");
    if (parts.length === 2) {
        let secondparts = parts[1].split(":");
        if (secondparts.length===1) {
            [hours, minutes, seconds] = parts[0].split(":").map(Number);
        } else {
            days = parseInt(parts[0], 10); // Days before the dot
            [hours, minutes, seconds] = parts[1].split(":").map(Number);
        }
    } else {
        [hours, minutes, seconds] = parts[0].split(":").map(Number);
    }

    // Round seconds to remove microseconds
    seconds = Math.floor(seconds);

    // Build the output dynamically
    let formattedParts = [];
    if (days > 0) formattedParts.push(`${days}d`);
    if (hours > 0) formattedParts.push(`${hours}h`);
    if (minutes > 0) formattedParts.push(`${minutes}m`);
    if (seconds > 0) formattedParts.push(`${seconds}s`);

    return formattedParts.length > 0 ? formattedParts.join(" ") : 'No time recorded';
}

   
    // ********************************************************************************/
    //              Helper functions - formats DateTime Deadline to human readable form
    // ********************************************************************************/
    export function formatDateTime(dateString) {
        let date = new Date(dateString);
        let now = new Date();
        let year = date.getFullYear();
        let month = date.toLocaleString('en-US', { month: 'short' }); 
        let day = date.getDate();
        let hours = date.getHours().toString().padStart(2, '0'); // Ensure two-digits
        let minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two-digits
        // If the year is the current year, omit it
        let showYear = year !== now.getFullYear();
        // Format string based on condition
        return showYear
            ? `${month} ${day}, ${year} @ ${hours}:${minutes}`
            : `${month} ${day} @ ${hours}:${minutes}`;
    }

    export function addTimeSpanToSeconds(timeSpanStr, totalSeconds) {
        // Split the TimeSpan by ":"
        const [hours, minutes, secondsWithMs] = timeSpanStr.split(":");
    
        // Split seconds from milliseconds
        const [seconds, milliseconds] = secondsWithMs.split(".");
    
        // Convert to total seconds (including milliseconds)
        const timeSpanInSeconds = (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds);
    
        // Add the TimeSpan seconds to your totalSeconds
        return totalSeconds + timeSpanInSeconds;
    }

    export const PopulatedStatusList = ({item, register}) => {

    return (<>       
        <label htmlFor="statusZero">Planning</label>
        <input type="radio" id="statusZero" name="status"
          defaultChecked={item.status === 0} value="0" {...register('status')} />
        <label htmlFor="statusOne">Active</label>
        <input type="radio" id="statusOne" name="status"
          defaultChecked={item.status === 1} value="1" {...register('status')} />
        <label htmlFor="statusTwo">Inactive</label>
        <input type="radio" id="statusTwo" name="status"
          defaultChecked={item.status === 2} value="2" {...register('status')} />
        <label htmlFor="statusThree">Complete</label>
        <input type="radio" id="statusThree" name="status"
          defaultChecked={item.status === 3} value="3" {...register('status')}  />
          </>
          )
    }

    export function renderTextWithLineBreaks(text){
        return text?.split('\n')?.map((line,i) => <p key={i}>{he.decode(line).replace('<br>','')}</p>)

    }