//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/topup_request_status.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'doku_topup_status.g.dart';

/// DokuTopupStatus
///
/// Properties:
/// * [id] 
/// * [status] 
@BuiltValue()
abstract class DokuTopupStatus implements Built<DokuTopupStatus, DokuTopupStatusBuilder> {
  @BuiltValueField(wireName: r'id')
  int get id;

  @BuiltValueField(wireName: r'status')
  TopupRequestStatus get status;
  // enum statusEnum {  pending,  approved,  rejected,  };

  DokuTopupStatus._();

  factory DokuTopupStatus([void updates(DokuTopupStatusBuilder b)]) = _$DokuTopupStatus;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DokuTopupStatusBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DokuTopupStatus> get serializer => _$DokuTopupStatusSerializer();
}

class _$DokuTopupStatusSerializer implements PrimitiveSerializer<DokuTopupStatus> {
  @override
  final Iterable<Type> types = const [DokuTopupStatus, _$DokuTopupStatus];

  @override
  final String wireName = r'DokuTopupStatus';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DokuTopupStatus object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    yield r'status';
    yield serializers.serialize(
      object.status,
      specifiedType: const FullType(TopupRequestStatus),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    DokuTopupStatus object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DokuTopupStatusBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.id = valueDes;
          break;
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TopupRequestStatus),
          ) as TopupRequestStatus;
          result.status = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DokuTopupStatus deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DokuTopupStatusBuilder();
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

