// @refresh reload
import { mount, StartClientTanstack } from '@solidjs/start/client';
import { inject } from '@vercel/analytics';

inject();

mount(() => <StartClientTanstack />, document.getElementById('app')!);
