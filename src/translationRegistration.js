import { config } from 'd2/lib/d2';

[
  'home',
  'tool',
  'organization',
  'category',
  'data_element',
  'misc',
  'external',    
].forEach(key => config.i18n.strings.add(key));
