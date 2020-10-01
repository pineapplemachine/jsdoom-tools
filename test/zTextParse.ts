import {ZParser} from "@src/lumps/zdoom/text";

export async function testTextParse(){
    const toParse1 = "\"STARGR2\"";
    const expected1 = "STARGR2";
    const parser1 = new ZParser(toParse1);
    const result1 = parser1.parseZString(0);
    if(result1 !== expected1){
        throw new Error(`${toParse1} does not match expected result: ${expected1} Result: ${result1}`);
    }
    const toParse2 = "\"\\cRZack\\cC is my name, and my colour is... \\C[DarkGreen]red???\\CC.\"";
    const expected2 = "Zack is my name, and my colour is... red???.";
    const parser2 = new ZParser(toParse2);
    const result2 = parser2.parseZString(0);
    if(result2 !== expected2){
        throw new Error(`${toParse2} does not match expected result: ${expected2}. Result: ${result2}`);
    }
    const toParse3 = "\"textures\\\\fullpath.png has a backslash. textures/fullpath.png has a forward slash.\"";
    const expected3 = "textures\\fullpath.png has a backslash. textures/fullpath.png has a forward slash.";
    const parser3 = new ZParser(toParse3);
    const result3 = parser3.parseZString(0);
    if(result3 !== expected3){
        throw new Error(`${toParse3} does not match expected result: ${expected3}. Result: ${result3}`);
    }
    const toParse4 = "The quick brown fox";
    const expected4 = "The";
    const parser4 = new ZParser(toParse4);
    const result4 = parser4.parseZString(0);
    if(result4 !== expected4){
        throw new Error(`${toParse4} does not match expected result: ${expected4}. Result: ${result4}`);
    }
    const toParse5 = "\"The \\\"bouncing bomb\\\" succeeded\"";
    const expected5 = "The \"bouncing bomb\" succeeded";
    const parser5 = new ZParser(toParse5);
    const result5 = parser5.parseZString(0);
    if(result5 !== expected5){
        throw new Error(`${toParse5} does not match expected result: ${expected5}. Result: ${result5}`);
    }
    const toParse6 = "\"\\114\\151\\156\\165\\170\\40\\106\\124\\127\"";
    const expected6 = "Linux FTW";
    const parser6 = new ZParser(toParse6);
    const result6 = parser6.parseZString(0);
    if(result6 !== expected6){
        throw new Error(`${toParse6} does not match expected result: ${expected6}. Result: ${result6}`);
    }
    const toParse7 = "\"\\x4c\\x69\\x6e\\x75\\x78\\x20\\x46\\x54\\x57\"";
    const expected7 = "Linux FTW";
    const parser7 = new ZParser(toParse7);
    const result7 = parser7.parseZString(0);
    if(result7 !== expected7){
        throw new Error(`${toParse7} does not match expected result: ${expected7}. Result: ${result7}`);
    }
}