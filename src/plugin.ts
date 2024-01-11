import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { C } from "./actions/c";
import { DC } from "./actions/dc";
import { M } from "./actions/m";
import { RC } from "./actions/rc";
import { T } from "./actions/t";
import { TC } from "./actions/tc";

// Enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

// Register the actions.
streamDeck.actions.registerAction(new C());
streamDeck.actions.registerAction(new DC());
streamDeck.actions.registerAction(new M());
streamDeck.actions.registerAction(new RC());
streamDeck.actions.registerAction(new T());
streamDeck.actions.registerAction(new TC());

// Connect to the Stream Deck.
streamDeck.connect();
