import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

import Tigrinho from '../assets/tigrinho.jpeg'

export default function MyCard() {
  return (
    <Card sx={{ maxWidth: 345, boxShadow: 3 }}> {/* sx={{ maxWidth: 400, backgroundColor: '#f5f5f5' }}*/}
      <CardActionArea>
        <CardMedia component="img" height="140" image={Tigrinho} alt="Tigrinho"/>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">Teste</Typography>
          <Typography variant="body2" color="text.secondary">Avanti Palestra.</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
