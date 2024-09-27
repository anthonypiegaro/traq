import { SchemaTypes } from "@/types/commonTypes"
import { RepsOnlySet, SetType, TimeOnlySet } from "@/db/services/types"

export interface RepsOnlyProps {
    sets: RepsOnlySet[];
}

export interface SetsProps {
    schema: SchemaTypes;
    sets: SetType[];
}

export interface RepsOnlySetProps {
    id: number;
    reps: number;
    setNumber: number;
}

export interface TimeOnlyProps {
    sets: TimeOnlySet[];
}

export interface TimeOnlySetProps {
    id: number;
    time: number;
    setNumber: number;
}