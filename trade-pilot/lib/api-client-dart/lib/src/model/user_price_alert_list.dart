//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/user_price_alert.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'user_price_alert_list.g.dart';

/// UserPriceAlertList
///
/// Properties:
/// * [alerts] 
@BuiltValue()
abstract class UserPriceAlertList implements Built<UserPriceAlertList, UserPriceAlertListBuilder> {
  @BuiltValueField(wireName: r'alerts')
  BuiltList<UserPriceAlert> get alerts;

  UserPriceAlertList._();

  factory UserPriceAlertList([void updates(UserPriceAlertListBuilder b)]) = _$UserPriceAlertList;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UserPriceAlertListBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UserPriceAlertList> get serializer => _$UserPriceAlertListSerializer();
}

class _$UserPriceAlertListSerializer implements PrimitiveSerializer<UserPriceAlertList> {
  @override
  final Iterable<Type> types = const [UserPriceAlertList, _$UserPriceAlertList];

  @override
  final String wireName = r'UserPriceAlertList';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UserPriceAlertList object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'alerts';
    yield serializers.serialize(
      object.alerts,
      specifiedType: const FullType(BuiltList, [FullType(UserPriceAlert)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UserPriceAlertList object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UserPriceAlertListBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'alerts':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(UserPriceAlert)]),
          ) as BuiltList<UserPriceAlert>;
          result.alerts.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UserPriceAlertList deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UserPriceAlertListBuilder();
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

