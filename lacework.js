import Tool from "./tool.js";

/**
 * Lacework security monitoring integration for GitHub runners.
 */
export default class Lacework extends Tool {
    static tool = "lacework";
    static envVar = "LACEWORK_ROOT";
    static installer = "lacework";

    constructor(deps = {}) {
        super(Lacework.tool);
        this._enabled = false;
        this.core = deps.core || require("@actions/core");
        this.exec = deps.exec || require("@actions/exec");
    }

    /**
   * Enables Lacework agent if security monitoring is requested
   */
    async setup(input) {
        if (!input || !input.includes("security-monitoring")) {
            this.core.info("Lacework security monitoring not enabled for this job");
            return true;
        }

        this.core.info("Enabling Lacework security monitoring for this job");
    
        try {
            await this.exec.exec("sudo", ["systemctl", "start", "lacework"]);
            this._enabled = true;
            this.core.info("Lacework security monitoring enabled successfully");
            return true;
        } catch (error) {
            this.core.warning(`Failed to enable Lacework monitoring: ${error.message}`);
            return false;
        }
    }

    /**
   * Disables Lacework agent if it was previously enabled
   */
    async cleanup() {
        if (!this._enabled) {
            return true;
        }

        this.core.info("Disabling Lacework security monitoring");
    
        try {
            await this.exec.exec("sudo", ["systemctl", "stop", "lacework"]);
            this.core.info("Lacework security monitoring disabled successfully");
            return true;
        } catch (error) {
            this.core.warning(`Failed to disable Lacework monitoring: ${error.message}`);
            return false;
        }
    }
}

// Register the class as a tool
Lacework.register();