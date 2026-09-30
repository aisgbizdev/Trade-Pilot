//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'instrument_request_rank.g.dart';

/// InstrumentRequestRank
///
/// Properties:
/// * [code] 
/// * [interestedUsers] 
/// * [lastRequestedAt] 
@BuiltValue()
abstract class InstrumentRequestRank implements Built<InstrumentRequestRank, InstrumentRequestRankBuilder> {
  @BuiltValueField(wireName: r'code')
  String get code;

  @BuiltValueField(wireName: r'interestedUsers')
  int get interestedUsers;

  @BuiltValueField(wireName: r'lastRequestedAt')
  DateTime get lastRequestedAt;

  InstrumentRequestRank._();

  factory InstrumentRequestRank([void updates(InstrumentRequestRankBuilder b)]) = _$InstrumentRequestRank;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(InstrumentRequestRankBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<InstrumentRequestRank> get serializer => _$InstrumentRequestRankSerializer();
}

class _$InstrumentRequestRankSerializer implements PrimitiveSerializer<InstrumentRequestRank> {
  @override
  final Iterable<Type> types = const [InstrumentRequestRank, _$InstrumentRequestRank];

  @override
  final String wireName = r'InstrumentRequestRank';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    InstrumentRequestRank object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'code';
    yield serializers.serialize(
      object.code,
      specifiedType: const FullType(String),
    );
    yield r'interestedUsers';
    yield serializers.serialize(
      object.interestedUsers,
      specifiedType: const FullType(int),
    );
    yield r'lastRequestedAt';
    yield serializers.serialize(
      object.lastRequestedAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    InstrumentRequestRank object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required InstrumentRequestRankBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'code':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.code = valueDes;
          break;
        case r'interestedUsers':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.interestedUsers = valueDes;
          break;
        case r'lastRequestedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.lastRequestedAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  InstrumentRequestRank deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = InstrumentRequestRankBuilder();
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

