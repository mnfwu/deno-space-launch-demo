import * as log from "https://deno.land/std/log/mod.ts";
import * as _ from "https://deno.land/x/lodash/lodash.js";

interface Launch {
    flightNumber: number;
    mission: string;
    rocket: string;
    customers: Array<string>;
}

const launches = new Map<number, Launch>(); 

const downloadLaunchData = async () => {
    log.info("Downloading launch data...")
    const res = await fetch("https://api.spacexdata.com/v3/launches", {
        method: "GET",
    });

    if(!res.ok) {
        log.warning("Problem downloading launch data.")
        throw new Error("Launch data download failed.")
    }

    const launchData = await res.json();
    for (const launch of launchData) {
        const payloads = launch["rocket"]["second_stage"]["payloads"]
        const customers = _.flatMap(payloads, (payload : any) => {
            return payload["customers"];
        })

        const flightData = {
            flightNumber: launch["flight_number"],
            mission: launch["mission_name"],
            rocket: launch["rocket"]["rocket_name"],
            customers: customers
        }

    launches.set(flightData.flightNumber, flightData);

    log.info(JSON.stringify(flightData));
    }
}

if (import.meta.main) {
    await downloadLaunchData();
    log.info(JSON.stringify(import.meta))
    log.info(`Download data for ${launches.size} SpaceX launches.`)
}