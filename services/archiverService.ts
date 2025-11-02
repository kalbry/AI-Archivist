
import { Platform, ExportFormat, LogEntry, LogLevel } from '../types';

interface RunArchiveJobParams {
    platforms: Platform[];
    formats: ExportFormat[];
    onLog: (log: LogEntry) => void;
    onProgress: (platformId: string, percent: number, message: string) => void;
    onComplete: () => void;
    onError: () => void;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createLog = (level: LogLevel, message: string, platformId?: string): LogEntry => ({
    timestamp: new Date(),
    level,
    message,
    platformId,
});

export const runArchiveJob = async ({
    platforms,
    formats,
    onLog,
    onProgress,
    onComplete,
    onError,
}: RunArchiveJobParams): Promise<void> => {
    onLog(createLog(LogLevel.Info, `Starting archive run for ${platforms.length} platform(s).`));
    onLog(createLog(LogLevel.Info, `Export formats: ${formats.join(', ')}.`));

    let hasError = false;

    const platformPromises = platforms.map(async (platform) => {
        try {
            await sleep(500);
            onLog(createLog(LogLevel.Info, `Connecting to ${platform.name}...`, platform.name));
            onProgress(platform.id, 10, 'Connecting...');

            await sleep(1000);
            onLog(createLog(LogLevel.Info, 'Connection successful. Authenticated.', platform.name));
            onProgress(platform.id, 20, 'Authenticated');

            // Simulate a random error for one of the platforms for demonstration
            if (platform.id === 'claude' && Math.random() > 0.5) {
                await sleep(1000);
                throw new Error('Two-factor authentication required. Please re-login.');
            }

            await sleep(1000);
            onLog(createLog(LogLevel.Info, `Listing conversations... Found ${platform.conversationCount}.`, platform.name));
            onProgress(platform.id, 30, `Listing conversations`);

            const totalConversations = platform.conversationCount;
            for (let i = 1; i <= totalConversations; i++) {
                // Speed up the simulation for large numbers
                const delay = totalConversations > 100 ? 5 : 20;
                await sleep(delay);
                if (i % 25 === 0 || i === totalConversations) {
                    const percent = 30 + (i / totalConversations) * 50;
                    onProgress(platform.id, percent, `Fetching ${i}/${totalConversations}`);
                }
            }

            onLog(createLog(LogLevel.Info, `All conversations fetched. Normalizing data...`, platform.name));
            onProgress(platform.id, 85, 'Normalizing data');
            
            await sleep(1500);
            onLog(createLog(LogLevel.Info, `Data normalized. Writing to export formats...`, platform.name));
            onProgress(platform.id, 95, `Exporting...`);

            await sleep(1000);
            onLog(createLog(LogLevel.Success, `Successfully archived ${platform.name}.`, platform.name));
            onProgress(platform.id, 100, 'Complete');

        } catch (error) {
            hasError = true;
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred.';
            onLog(createLog(LogLevel.Error, `Failed to archive: ${errorMessage}`, platform.name));
            onProgress(platform.id, 100, 'Failed');
            // Continue with other platforms
        }
    });

    await Promise.all(platformPromises);

    await sleep(500);
    onLog(createLog(LogLevel.Info, "Finalizing manifest..."));
    await sleep(1000);

    if (hasError) {
        onLog(createLog(LogLevel.Warn, "Archive run completed with one or more errors."));
        onError();
    } else {
        onLog(createLog(LogLevel.Success, "Archive run completed successfully."));
        onComplete();
    }
};
