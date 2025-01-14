import React from 'react';
import { Container, Link, Typography, Box, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LetterboxdIcon from '../svg/letterboxd-logo';
import LastfmIcon from '../svg/lastfm-logo';
import styles from './footer.module.scss';

function Footer() {
  return (
    <footer className={styles.footer}>
      <Container maxWidth='lg'>
        <Stack direction='column' spacing={2} alignItems='center'>
          <Box className={styles.logo}>
            <Link
              href='https://github.com/martinstereo'
              target='_blank'
              rel='noopener noreferrer'>
              <GitHubIcon fontSize='large' />
            </Link>
            <Link
              href='https://letterboxd.com/martinstereo/'
              target='_blank'
              rel='noopener noreferrer'>
              <LetterboxdIcon />
            </Link>
            <Link href='https://www.last.fm' target='_blank' rel='noopener noreferrer'>
              <LastfmIcon />
            </Link>
          </Box>
          <Box className={styles.developedBy}>
            <Typography
              variant='body2'
              color='#EEEEEE'
              className={styles.text}
              sx={{ fontFamily: 'var(--font-geist-sans)' }}>
              Created by Martin Steiro
            </Typography>
          </Box>
        </Stack>
      </Container>
    </footer>
  );
}

export default Footer;
