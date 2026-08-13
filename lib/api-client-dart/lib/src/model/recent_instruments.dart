//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/recent_instruments_instruments_inner.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'recent_instruments.g.dart';

/// RecentInstruments
///
/// Properties:
/// * [instruments] 
@BuiltValue()
abstract class RecentInstruments implements Built<RecentInstruments, RecentInstrumentsBuilder> {
  @BuiltValueField(wireName: r'instruments')
  BuiltList<RecentInstrumentsInstrumentsInner> get instruments;

  RecentInstruments._();

  factory RecentInstruments([void updates(RecentInstrumentsBuilder b)]) = _$RecentInstruments;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(RecentInstrumentsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<RecentInstruments> get serializer => _$RecentInstrumentsSerializer();
}

class _$RecentInstrumentsSerializer implements PrimitiveSerializer<RecentInstruments> {
  @override
  final Iterable<Type> types = const [RecentInstruments, _$RecentInstruments];

  @override
  final String wireName = r'RecentInstruments';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    RecentInstruments object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'instruments';
    yield serializers.serialize(
      object.instruments,
      specifiedType: const FullType(BuiltList, [FullType(RecentInstrumentsInstrumentsInner)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    RecentInstruments object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required RecentInstrumentsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'instruments':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(RecentInstrumentsInstrumentsInner)]),
          ) as BuiltList<RecentInstrumentsInstrumentsInner>;
          result.instruments.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  RecentInstruments deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = RecentInstrumentsBuilder();
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

