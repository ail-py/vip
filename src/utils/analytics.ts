
export class Analytics {
    private engine: AnalyticsEngine;

    constructor(engine: AnalyticsEngine) {
        this.engine = engine;
    }

    track(event: string, data: Record<string, any> = {}) {
        this.engine.writeDataPoint({
            blobs: [event, ...Object.values(data).map(v => String(v))],
            indexes: [event],
        });
    }

    error(data: { message: string, error?: any }) {
        const errorMessage = data.error instanceof Error ? data.error.message : String(data.error);
        this.engine.writeDataPoint({
            blobs: ["error", data.message, errorMessage],
            indexes: ["error"],
        });
    }
}
