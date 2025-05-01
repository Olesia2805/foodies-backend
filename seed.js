import fs from 'fs/promises';
import path from 'path';
import sequelize from './db/Sequelize.js';
import User from './db/models/User.js';
import Area from './db/models/Areas.js';
import bcrypt from 'bcrypt';

const seedData = async () => {
  try {
    
    const dataDir = path.join(process.cwd(), 'data');
    const usersData = JSON.parse(await fs.readFile(path.join(dataDir, 'users.json'), 'utf-8'));
    const areasData = JSON.parse(await fs.readFile(path.join(dataDir, 'areas.json'), 'utf-8'));

    const formattedAreasData = areasData.map(area => ({
      id: area._id.$oid, 
      name: area.name
    }));

    const hashedUsersData = usersData.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password || 'defaultPassword', 10),
    }));

    
    await sequelize.sync({ force: true });

    
    await User.bulkCreate(hashedUsersData);
    await Area.bulkCreate(formattedAreasData);

    console.log('Дані успішно завантажено до бази даних!');
    process.exit(0);
  } catch (error) {
    console.error('Помилка під час завантаження даних:', error);
    process.exit(1);
  }
};

seedData();