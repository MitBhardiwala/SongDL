// hooks/useDownloadMp3.ts
import { useMutation } from "@tanstack/react-query";
import { downloadMp3 } from "@/api/download";

export const useDownloadMp3 = () => {
    return useMutation({
        mutationFn: downloadMp3,
        onSuccess: ({ blob, title }) => {
            const objectUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = title || "song.mp3";
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(objectUrl);
        },
    });
};