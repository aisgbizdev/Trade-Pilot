//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/notification.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'notifications_list.g.dart';

/// NotificationsList
///
/// Properties:
/// * [notifications] 
/// * [unreadCount] 
@BuiltValue()
abstract class NotificationsList implements Built<NotificationsList, NotificationsListBuilder> {
  @BuiltValueField(wireName: r'notifications')
  BuiltList<Notification> get notifications;

  @BuiltValueField(wireName: r'unreadCount')
  int get unreadCount;

  NotificationsList._();

  factory NotificationsList([void updates(NotificationsListBuilder b)]) = _$NotificationsList;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(NotificationsListBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<NotificationsList> get serializer => _$NotificationsListSerializer();
}

class _$NotificationsListSerializer implements PrimitiveSerializer<NotificationsList> {
  @override
  final Iterable<Type> types = const [NotificationsList, _$NotificationsList];

  @override
  final String wireName = r'NotificationsList';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    NotificationsList object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'notifications';
    yield serializers.serialize(
      object.notifications,
      specifiedType: const FullType(BuiltList, [FullType(Notification)]),
    );
    yield r'unreadCount';
    yield serializers.serialize(
      object.unreadCount,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    NotificationsList object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required NotificationsListBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'notifications':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(Notification)]),
          ) as BuiltList<Notification>;
          result.notifications.replace(valueDes);
          break;
        case r'unreadCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.unreadCount = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  NotificationsList deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = NotificationsListBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

