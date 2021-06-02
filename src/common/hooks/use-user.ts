import {useAtom} from "jotai";
import {userAtom} from "@store/auth";

export function useUser() {
    return useAtom(userAtom)
}
