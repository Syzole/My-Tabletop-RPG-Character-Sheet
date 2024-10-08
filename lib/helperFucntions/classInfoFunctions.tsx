import { Feature } from "../types";
import * as types from "@prisma/client";


export function isClassFeature(feature: Feature): feature is types.Class_Feature {
    return 'class' in feature; // `class` property is only in `Class_Feature`
}

export function isSubclassFeature(feature: Feature): feature is types.Subclass_Feature {
    return 'subclass' in feature; // `subclass` property is only in `Subclass_Feature`
}
