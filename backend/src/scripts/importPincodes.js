"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var JSONStream = require("JSONStream");
var dotenv = __importStar(require("dotenv"));
var Pincode_1 = __importDefault(require("../models/Pincode"));
var db_1 = __importDefault(require("../config/db"));
dotenv.config();
var importPincodes = function () { return __awaiter(void 0, void 0, void 0, function () {
    var filePath, stream, parser_1, count_1, batch_1, BATCH_SIZE_1, processing, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log("Connecting to Database...");
                return [4 /*yield*/, (0, db_1.default)()];
            case 1:
                _a.sent();
                console.log("Connected to Database. Checking file...");
                filePath = path.join(process.cwd(), "data", "india_pincodes.geojson");
                if (!fs.existsSync(filePath)) {
                    console.error("File not found at: ".concat(filePath));
                    process.exit(1);
                }
                console.log("Starting pincodes import...");
                stream = fs.createReadStream(filePath, { encoding: "utf8" });
                parser_1 = JSONStream.parse("features.*");
                count_1 = 0;
                batch_1 = [];
                BATCH_SIZE_1 = 500;
                processing = false;
                stream.pipe(parser_1);
                parser_1.on("data", function (feature) { return __awaiter(void 0, void 0, void 0, function () {
                    var pin, state, dist, err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                parser_1.pause();
                                if (feature.geometry && feature.properties) {
                                    pin = feature.properties.Pincode ||
                                        feature.properties.pincode ||
                                        feature.properties.PINCODE ||
                                        feature.properties.pin_code;
                                    state = feature.properties.Circle ||
                                        feature.properties.Region ||
                                        feature.properties.ST_NM ||
                                        feature.properties.state ||
                                        feature.properties.statename ||
                                        feature.properties.State;
                                    dist = feature.properties.Division ||
                                        feature.properties.DISTRICT ||
                                        feature.properties.district ||
                                        feature.properties.District;
                                    if (pin) {
                                        batch_1.push({
                                            pincode: String(pin),
                                            state: state || "",
                                            district: dist || "",
                                            boundary: feature.geometry,
                                        });
                                    }
                                }
                                count_1++;
                                if (!(batch_1.length >= BATCH_SIZE_1)) return [3 /*break*/, 5];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, Pincode_1.default.insertMany(batch_1, { ordered: false })];
                            case 2:
                                _a.sent();
                                console.log("Imported ".concat(count_1, " pincodes..."));
                                return [3 /*break*/, 4];
                            case 3:
                                err_1 = _a.sent();
                                if (err_1.code === 11000) {
                                    // Bulk write error for duplicates (ordered: false ignores dups if we handle the throw)
                                    console.log("Imported ".concat(count_1, " pincodes (Some duplicates ignored)..."));
                                }
                                else {
                                    console.error("Batch insert error:", err_1.message);
                                }
                                return [3 /*break*/, 4];
                            case 4:
                                batch_1 = [];
                                _a.label = 5;
                            case 5:
                                parser_1.resume();
                                return [2 /*return*/];
                        }
                    });
                }); });
                parser_1.on("end", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(batch_1.length > 0)) return [3 /*break*/, 4];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, Pincode_1.default.insertMany(batch_1, { ordered: false })];
                            case 2:
                                _a.sent();
                                console.log("Imported remaining pincodes...");
                                return [3 /*break*/, 4];
                            case 3:
                                err_2 = _a.sent();
                                if (err_2.code !== 11000)
                                    console.error("Final batch insert error");
                                return [3 /*break*/, 4];
                            case 4:
                                console.log("Import completed successfully! Total processed objects: ".concat(count_1, "."));
                                process.exit(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                parser_1.on("error", function (err) {
                    console.error("Error parsing JSON:", err);
                    process.exit(1);
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Import failed:", error_1);
                process.exit(1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
importPincodes();
