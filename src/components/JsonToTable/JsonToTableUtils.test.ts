import JSONToTableUtils from "./JsonToTableUtils";
import { JSONObjectType } from "./JsonToTableUtils";

test("getObjectType", () => {
    expect(JSONToTableUtils.getObjectType([1])).toBe(JSONObjectType.Array);
    expect(JSONToTableUtils.getObjectType({})).toBe(JSONObjectType.Object);
    expect(JSONToTableUtils.getObjectType({ key: "value" })).toBe(
        JSONObjectType.ObjectWithNonNumericKeys
    );
    expect(JSONToTableUtils.getObjectType(1)).toBe(JSONObjectType.Primitive);
    expect(JSONToTableUtils.getObjectType("")).toBe(JSONObjectType.Primitive);
    expect(JSONToTableUtils.getObjectType("XXX")).toBe(JSONObjectType.Primitive);
});

test("getUniqueObjectKeys", () => {
    expect(JSONToTableUtils.getUniqueObjectKeys([]).labels.length).toBe(0);
    expect(JSONToTableUtils.getUniqueObjectKeys([]).type).toBe(
        JSONObjectType.Object
    );
});
