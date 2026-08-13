//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/fundamental_drift_citation.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'fundamental_drift.g.dart';

/// Summary of how many of the AI's original fundamental citations are no longer present in the freshly-fetched window.
///
/// Properties:
/// * [totalCitations] - Total citations the AI emitted at analysis time (newsTitles + calendarEvents).
/// * [missingCitations] - Original citations that no longer match any item in the fresh snapshot.
@BuiltValue()
abstract class FundamentalDrift implements Built<FundamentalDrift, FundamentalDriftBuilder> {
  /// Total citations the AI emitted at analysis time (newsTitles + calendarEvents).
  @BuiltValueField(wireName: r'totalCitations')
  int get totalCitations;

  /// Original citations that no longer match any item in the fresh snapshot.
  @BuiltValueField(wireName: r'missingCitations')
  BuiltList<FundamentalDriftCitation> get missingCitations;

  FundamentalDrift._();

  factory FundamentalDrift([void updates(FundamentalDriftBuilder b)]) = _$FundamentalDrift;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(FundamentalDriftBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<FundamentalDrift> get serializer => _$FundamentalDriftSerializer();
}

class _$FundamentalDriftSerializer implements PrimitiveSerializer<FundamentalDrift> {
  @override
  final Iterable<Type> types = const [FundamentalDrift, _$FundamentalDrift];

  @override
  final String wireName = r'FundamentalDrift';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    FundamentalDrift object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'totalCitations';
    yield serializers.serialize(
      object.totalCitations,
      specifiedType: const FullType(int),
    );
    yield r'missingCitations';
    yield serializers.serialize(
      object.missingCitations,
      specifiedType: const FullType(BuiltList, [FullType(FundamentalDriftCitation)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    FundamentalDrift object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required FundamentalDriftBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'totalCitations':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalCitations = valueDes;
          break;
        case r'missingCitations':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(FundamentalDriftCitation)]),
          ) as BuiltList<FundamentalDriftCitation>;
          result.missingCitations.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  FundamentalDrift deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = FundamentalDriftBuilder();
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

