import React from 'react';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Badge from '../components/Badge'; // Masukkan import Badge di sini
import Container from '../components/Container';
import Avatar from '../components/Avatar';
import Footer from '../components/Footer';

export default function Components() {
    return (
        <Container>
            <PageHeader title="Components" />
            <p>Ini halaman components</p>

            <div className="flex gap-2">
                <Button>Simpan</Button>
                <Button type="secondary">Simpan</Button>
                <Button type="success">Simpan</Button>
                <Button type="danger">Simpan</Button>
                <Button type="warning">Simpan</Button>
            </div>

            <div className="flex gap-2 mt-2">
                <Badge type="primary">Selesai</Badge>
                <Badge type="secondary">Prosess</Badge>
                <Badge type="success">Berhasil</Badge>
                <Badge type="danger">gagal</Badge>
                <Badge type="warning">Badge</Badge>
            </div>

            <div className="flex gap-2 mt-2">
                <Avatar name="budi">MH</Avatar>
                <Avatar name="joko">MH</Avatar>
            </div>

            <Card>
		<h2 className="text-xl font-bold">Judul Card</h2>
		<p className="text-gray-600">Ini adalah isi dari card.</p>
</Card>
            <Footer /> 
        </Container>
    );
}
        