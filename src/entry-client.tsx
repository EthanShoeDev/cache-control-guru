// @refresh reload
import { mount, StartClientTanstack } from '@solidjs/start/client';
import { inject } from '@vercel/analytics';

inject();

const appElement = document.getElementById('app');
if (!appElement) throw new Error('Must have a #app element');
mount(() => <StartClientTanstack />, appElement);
