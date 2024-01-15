import streamDeck from '@elgato/streamdeck'; // streamDeck, { LogLevel }

import { C } from './actions/c';
import { DC } from './actions/dc';
import { RC } from './actions/rc';
import { TC } from './actions/tc';

// Enable 'trace' logging so that all messages between the Stream Deck and the plugin are recorded
// streamDeck.logger.setLevel(LogLevel.TRACE);

// Register the actions.
streamDeck.actions.registerAction(new C());
streamDeck.actions.registerAction(new DC());
streamDeck.actions.registerAction(new RC());
streamDeck.actions.registerAction(new TC());

// Connect to the Stream Deck.
streamDeck.connect();
