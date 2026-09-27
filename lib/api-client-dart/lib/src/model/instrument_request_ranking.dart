//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/instrument_request_rank.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'instrument_request_ranking.g.dart';

/// InstrumentRequestRanking
///
/// Properties:
/// * [requests] 
@BuiltValue()
abstract class InstrumentRequestRanking implements Built<InstrumentRequestRanking, InstrumentRequestRankingBuilder> {
  @BuiltValueField(wireName: r'requests')
  BuiltList<InstrumentRequestRank> get requests;

  InstrumentRequestRanking._();

  factory InstrumentRequestRanking([void updates(InstrumentRequestRankingBuilder b)]) = _$InstrumentRequestRanking;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(InstrumentRequestRankingBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<InstrumentRequestRanking> get serializer => _$InstrumentRequestRankingSerializer();
}

class _$InstrumentRequestRankingSerializer implements PrimitiveSerializer<InstrumentRequestRanking> {
  @override
  final Iterable<Type> types = const [InstrumentRequestRanking, _$InstrumentRequestRanking];

  @override
  final String wireName = r'InstrumentRequestRanking';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    InstrumentRequestRanking object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'requests';
    yield serializers.serialize(
      object.requests,
      specifiedType: const FullType(BuiltList, [FullType(InstrumentRequestRank)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    InstrumentRequestRanking object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required InstrumentRequestRankingBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'requests':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(InstrumentRequestRank)]),
          ) as BuiltList<InstrumentRequestRank>;
          result.requests.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  InstrumentRequestRanking deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = InstrumentRequestRankingBuilder();
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

