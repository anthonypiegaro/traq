import { useState } from "react";
import { Text } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Exercise } from "@/db/schema";

import { hideExercise } from "@/db/queries";

import ConfirmationPopUp from "@/components/Common/ConfirmationPopUp/ConfirmationPopUp";
import ExerciseDetailViewer from "@/components/Common/ExerciseDetailViewer/ExerciseDetailViewer";
import ExerciseListItem from "./ExerciseListItem";

interface ExerciseListProps {
    isPending: boolean;
    isError: boolean;
    error: Error | null;
    data: Exercise[] | undefined;
}

export default function ExerciseList({ isPending, isError, error, data }: ExerciseListProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [hideExerciseId, setHideExerciseId] = useState<number | undefined>(undefined);
    const [hideExerciseHeader, setHideExerciseHeader] = useState("");
    const [hideExerciseDescription, setHideExerciseDescription] = useState("");
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number) => hideExercise(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["exercises"]});
        }
    });

    const openDetails = () => setShowDetails(true);

    const openHideExercisePopUp = (id: number, name: string) => {
        const header = `Hide Exercise ${name}`
        const description = `Confirm you want to hide exercise ${name}. This will remove the exercise and make it non accessable.`
        setHideExerciseHeader(header);
        setHideExerciseDescription(description);
        setHideExerciseId(id);
    }

    const closeHideExercisePopUp = () => {
        setHideExerciseId(undefined);
        setHideExerciseHeader("");
        setHideExerciseDescription("");
    }

    const handleHideExercise = () => {
        console.log("Hiding exercise", hideExerciseId);
        if (hideExerciseId) {
            mutation.mutate(hideExerciseId);
        }
        closeHideExercisePopUp();
    }


    if (isPending) {
        return <Text>Loading...</Text>
    }

    if (isError) {
        return <Text>Error: {error?.message}</Text>
    }

    if (data?.length == 0) {
        return <Text>No exercises</Text>
    }

    return (
        <>
            <ExerciseDetailViewer showDetails={showDetails} setShowDetails={setShowDetails} />
            {data?.map(exercise => (
                <ExerciseListItem
                    key={exercise.id}
                    id={exercise.id} 
                    name={exercise.name} 
                    schema={exercise.schema} 
                    openDetails={openDetails}
                    openHideExercisePopUp={() => openHideExercisePopUp(exercise.id, exercise.name)}
                />
            ))}

            {hideExerciseId && 
            <ConfirmationPopUp 
                header={hideExerciseHeader} 
                description={hideExerciseDescription}
                showConfirmation={hideExerciseId ? true : false}
                closeConfirmation={closeHideExercisePopUp}
                onConfirm={handleHideExercise}
            />}
        </>
    )
}