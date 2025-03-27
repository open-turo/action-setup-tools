import { jest } from '@jest/globals';
import Lacework from "./lacework.js";

describe("Lacework", () => {
    // Create mock dependencies
    const mockCore = {
        info: jest.fn(),
        warning: jest.fn(),
        setOutput: jest.fn(),
        exportVariable: jest.fn()
    };
  
    const mockExec = {
        exec: jest.fn()
    };
  
    beforeEach(() => {
        jest.clearAllMocks();
        mockExec.exec.mockResolvedValue({ code: 0, stdout: "", stderr: "" });
    });
  
    test("has the correct name", () => {
        const tool = new Lacework({ core: mockCore, exec: mockExec });
        expect(tool.name).toBe("lacework");
    });
  
    test("skips setup when input doesn't contain security-monitoring", async () => {
        const tool = new Lacework({ core: mockCore, exec: mockExec });
        await tool.setup("other-input");
    
        expect(mockCore.info).toHaveBeenCalledWith("Lacework security monitoring not enabled for this job");
        expect(mockExec.exec).not.toHaveBeenCalled();
    });
  
    test("enables monitoring when security-monitoring is requested", async () => {
        const tool = new Lacework({ core: mockCore, exec: mockExec });
        const result = await tool.setup("security-monitoring");
    
        expect(result).toBe(true);
        expect(tool._enabled).toBe(true);
        expect(mockExec.exec).toHaveBeenCalledWith("sudo", ["systemctl", "start", "lacework"]);
        expect(mockCore.info).toHaveBeenCalledWith("Lacework security monitoring enabled successfully");
    });
  
    test("handles startup failures", async () => {
        mockExec.exec.mockRejectedValueOnce(new Error("Failed to start"));
    
        const tool = new Lacework({ core: mockCore, exec: mockExec });
        const result = await tool.setup("security-monitoring");
    
        expect(result).toBe(false);
        expect(tool._enabled).toBe(false);
        expect(mockCore.warning).toHaveBeenCalledWith("Failed to enable Lacework monitoring: Failed to start");
    });
  
    test("skips cleanup when not enabled", async () => {
        const tool = new Lacework({ core: mockCore, exec: mockExec });
        const result = await tool.cleanup();
    
        expect(result).toBe(true);
        expect(mockExec.exec).not.toHaveBeenCalled();
    });
  
    test("stops the service during cleanup when enabled", async () => {
        const tool = new Lacework({ core: mockCore, exec: mockExec });
        tool._enabled = true;
        const result = await tool.cleanup();
    
        expect(result).toBe(true);
        expect(mockExec.exec).toHaveBeenCalledWith("sudo", ["systemctl", "stop", "lacework"]);
        expect(mockCore.info).toHaveBeenCalledWith("Lacework security monitoring disabled successfully");
    });
  
    test("handles shutdown failures", async () => {
        mockExec.exec.mockRejectedValueOnce(new Error("Failed to stop"));
    
        const tool = new Lacework({ core: mockCore, exec: mockExec });
        tool._enabled = true;
        const result = await tool.cleanup();
    
        expect(result).toBe(false);
        expect(mockCore.warning).toHaveBeenCalledWith("Failed to disable Lacework monitoring: Failed to stop");
    });
});