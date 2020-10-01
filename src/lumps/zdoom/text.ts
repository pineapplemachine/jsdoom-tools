// This module is for generic text parsers

// An interface which serves the same purpose as a C/C++ string pointer
interface StringPointer {
    // The string
    data: string;
    // The location
    location: number;
}

interface HandledEscape {
    // The string data to be inserted in place of the escape sequence
    data: string;
    // The length of the escape sequence, not including backslash
    forward: number;
}

export class ZParser {
    // The text data as a string
    data: string;
    // Parser position
    position: number;
    // Handlers for escape sequences within strings of text. Takes a "pointer",
    // returns the data to be inserted, and how many places to move forward.
    static escapeHandlers: {[char: string]: (pointer: StringPointer) => HandledEscape} = {
        "0": ZParser.parseOctal,
        "1": ZParser.parseOctal,
        "2": ZParser.parseOctal,
        "3": ZParser.parseOctal,
        /*
        // Octal numbers >= 400 are >= 256 in decimal
        "4": ZParser.parseOctal,
        "5": ZParser.parseOctal,
        "6": ZParser.parseOctal,
        "7": ZParser.parseOctal,
        */
        "a": (pointer) => {return {data: "", forward: 1}; },
        "b": (pointer) => {return {data: "", forward: 1}; },
        "c": (pointer) => {
            const colourChar = pointer.data[pointer.location];
            // Color is from TEXTCOLO
            if(colourChar === "["){
                let length = 1;
                let location = pointer.location;
                while(pointer.data[location++] !== "]"){
                    length += 1;
                }
                return {data: "", forward: length};
            }
            return {data: "", forward: 1};
        },
        "f": (pointer) => {return {data: "", forward: 1}; },
        "n": (pointer) => {return {data: "\n", forward: 1}; },
        "r": (pointer) => {return {data: "\r", forward: 1}; },
        "t": (pointer) => {return {data: "\t", forward: 1}; },
        "v": (pointer) => {return {data: "\n", forward: 1}; },
        "x": (pointer) => {
            const hexDigits = pointer.data.substring(pointer.location + 1, pointer.location + 3);
            const hex = Number.parseInt(hexDigits, 16);
            return {data: String.fromCharCode(hex), forward: 3};
        },
        "?": (pointer) => {return {data: "", forward: 1}; },
        "\n": (pointer) => {return {data: "", forward: 1}; }, // Ignore actual newline
    };

    static parseOctal(pointer: StringPointer): HandledEscape {
        const octalDigits = pointer.data.substring(pointer.location, pointer.location + 3);
        const octal = Number.parseInt(octalDigits, 8);
        // Octal escapes are limited to ASCII
        if(octal <= 255){
            return {
                data: String.fromCharCode(octal),
                forward: 3,
            };
        }
        return {data: "", forward: 3};
    }

    constructor(data: string, start: number = 0){
        this.data = data;
        this.position = start;
    }

    parseZString(at: number): string {
        let location = at;
        let preAdvance = 0;
        const startsWithQuoteMark = this.data[location] === "\"";
        if(startsWithQuoteMark){
            preAdvance += 1;
            location += 1;
        }
        // The next character is "escaped"
        let advance = 0;
        let escape: boolean = false;
        let text = "";
        const parseUntil = (stopCondition: () => boolean) => {
            while(stopCondition()){
                if(escape){
                    // Escape character was seen - parse the data associated with it.
                    const escapeChar = this.data[location + advance].toLowerCase();
                    // Handle the special escape character if applicable
                    if(ZParser.escapeHandlers.hasOwnProperty(escapeChar)){
                        const escapeData = ZParser.escapeHandlers[escapeChar]({data: this.data, location: location + advance + 1});
                        // Add escapeData.data to the text, and move the "cursor" ahead by escapeData.forward
                        text += escapeData.data;
                        advance += escapeData.forward;
                    }else{
                        // If not, just add it to the text.
                        text += escapeChar;
                    }
                    escape = false;
                }else if(this.data[location + advance] === "\\"){
                    // The backslash usually indicates an escape character
                    escape = true;
                }else{
                    text += this.data[location + advance];
                }
                advance += 1;
            }
        }
        if(startsWithQuoteMark){
            // Strings must be enclosed within quotation marks. However, some
            // strings can have quotation marks within them if they are prefixed
            // with a backslash
            parseUntil(() => this.data[location + advance] !== "\"" || escape);
        }else{
            parseUntil(() => {
                return (
                    this.data[location + advance] !== " " &&
                    this.data[location + advance] !== "\t" &&
                    this.data[location + advance] !== "\n");
            });
        }
        this.position += preAdvance;
        this.position += advance;
        return text;
    }
}
