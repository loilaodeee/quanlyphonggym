export function formatDate(dateString){

    if(!dateString) return "--";

    return new Date(dateString)
        .toLocaleDateString("vi-VN");

}

export function formatTime(dateString){

    if(!dateString) return "--";

    return new Date(dateString)
        .toLocaleTimeString(
            "vi-VN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}

export function formatDateTime(dateString){

    if(!dateString) return "--";

    const date = new Date(dateString);

    return (
        date.toLocaleDateString("vi-VN")
        + " "
        + date.toLocaleTimeString(
            "vi-VN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        )
    );

}