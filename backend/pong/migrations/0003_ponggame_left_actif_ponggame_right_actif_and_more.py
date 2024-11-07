# Generated by Django 5.1.2 on 2024-11-05 04:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0002_ponggame_delete_message_delete_room'),
    ]

    operations = [
        migrations.AddField(
            model_name='ponggame',
            name='left_actif',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='ponggame',
            name='right_actif',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='ponggame',
            name='ball_speed_x',
            field=models.IntegerField(default=10),
        ),
        migrations.AlterField(
            model_name='ponggame',
            name='ball_speed_y',
            field=models.IntegerField(default=10),
        ),
    ]
