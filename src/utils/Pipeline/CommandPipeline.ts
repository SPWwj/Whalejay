import { ChatStreamCommand } from "../commands/ChatStreamCommand";
import { Command } from "../commands/Command";
import { GenerateImageCommand } from "../commands/GenerateImageCommand";
import { TextToSpeechCommand } from "../commands/TextToSpeechCommand";

export default class CommandPipeline {
  static process(userInput: string): Command | null {
    // Try matching each command and return the first match
    return (
      GenerateImageCommand.Create(userInput) ||
      TextToSpeechCommand.Create(userInput) ||
      ChatStreamCommand.Create(userInput)
    );
  }
}