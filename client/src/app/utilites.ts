export function toTitle(str: string): string {
    if (str.length <= 0)
        return str;
    else if (str.length == 1) 
        return str.toUpperCase();
    return str[0].toUpperCase() + str.substring(1, str.length);
}

export function formatTitle(title: string): string {
    return title.toLowerCase().replace(/\s/g, "");
}